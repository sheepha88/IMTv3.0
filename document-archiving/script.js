// 데이터 모델 및 스토리지 유틸
const STORAGE_KEY = 'doc_archiving_state_v1';
const ROLES = ['Admin', 'Editor', 'Viewer'];

/**
 * state schema
 * {
 *   currentRole: 'Admin' | 'Editor' | 'Viewer',
 *   selectedFolderId: string,
 *   folders: Array<{ id, name, description, parentId, uploadRoles: string[], createdAt }>,
 *   files: Array<{ id, folderId, name, type, size, uploadedAt, ownerRole, viewRoles: string[], editRoles: string[] }>
 * }
 */

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (_) { return null; }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createInitialState() {
  const rootId = crypto.randomUUID();
  const designId = crypto.randomUUID();
  const specsId = crypto.randomUUID();
  const qaId = crypto.randomUUID();

  return {
    currentRole: 'Admin',
    selectedFolderId: rootId,
    folders: [
      { id: rootId, name: '프로젝트 문서', description: '프로젝트 전반 문서 보관', parentId: null, uploadRoles: ['Admin', 'Editor'], createdAt: Date.now() },
      { id: designId, name: 'Design', description: 'UI/UX 산출물', parentId: rootId, uploadRoles: ['Admin', 'Editor'], createdAt: Date.now() },
      { id: specsId, name: 'Specs', description: '요구사항/설계 문서', parentId: rootId, uploadRoles: ['Admin'], createdAt: Date.now() },
      { id: qaId, name: 'QA', description: '테스트 케이스/리포트', parentId: rootId, uploadRoles: ['Admin', 'Editor'], createdAt: Date.now() },
    ],
    files: [
      { id: crypto.randomUUID(), folderId: specsId, name: '요구사항정의서_v1.pdf', type: 'pdf', size: 124000, uploadedAt: Date.now(), ownerRole: 'Admin', viewRoles: ['Admin', 'Editor', 'Viewer'], editRoles: ['Admin'] },
      { id: crypto.randomUUID(), folderId: designId, name: '메인화면-와이어프레임.png', type: 'image', size: 560000, uploadedAt: Date.now(), ownerRole: 'Editor', viewRoles: ['Admin', 'Editor', 'Viewer'], editRoles: ['Admin', 'Editor'] },
      { id: crypto.randomUUID(), folderId: qaId, name: '회귀테스트_리포트.xlsx', type: 'excel', size: 89000, uploadedAt: Date.now(), ownerRole: 'Editor', viewRoles: ['Admin', 'Editor'], editRoles: ['Admin', 'Editor'] },
    ],
  };
}

function getState() {
  let state = loadState();
  if (!state) {
    state = createInitialState();
    saveState(state);
  }
  return state;
}

function setState(producer) {
  const state = getState();
  const next = producer(structuredClone(state));
  saveState(next);
  return next;
}

// 권한 유틸
function canUploadToFolder(role, folder) {
  return role === 'Admin' || folder.uploadRoles.includes(role);
}
function canViewFile(role, file) {
  return role === 'Admin' || file.viewRoles.includes(role);
}
function canEditFile(role, file) {
  return role === 'Admin' || file.editRoles.includes(role);
}

// DOM refs
const roleSelect = document.getElementById('roleSelect');
const resetDataBtn = document.getElementById('resetDataBtn');
const folderTree = document.getElementById('folderTree');
const addFolderBtn = document.getElementById('addFolderBtn');
const editFolderBtn = document.getElementById('editFolderBtn');
const deleteFolderBtn = document.getElementById('deleteFolderBtn');

const uploadBtn = document.getElementById('uploadBtn');
const moveBtn = document.getElementById('moveBtn');
const deleteFileBtn = document.getElementById('deleteFileBtn');
const refreshBtn = document.getElementById('refreshBtn');
const searchInput = document.getElementById('searchInput');
const selectAllCheckbox = document.getElementById('selectAll');
const fileTableBody = document.getElementById('fileTableBody');
const infoPanel = document.getElementById('infoPanel');

// Dialog refs
const uploadDialog = document.getElementById('uploadDialog');
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const viewRolesContainer = document.getElementById('viewRolesContainer');
const editRolesContainer = document.getElementById('editRolesContainer');
const confirmUploadBtn = document.getElementById('confirmUploadBtn');

const folderDialog = document.getElementById('folderDialog');
const folderForm = document.getElementById('folderForm');
const folderDialogTitle = document.getElementById('folderDialogTitle');
const folderNameInput = document.getElementById('folderNameInput');
const folderDescInput = document.getElementById('folderDescInput');
const folderUploadRolesContainer = document.getElementById('folderUploadRolesContainer');
const folderSaveBtn = document.getElementById('folderSaveBtn');

const moveDialog = document.getElementById('moveDialog');
const moveForm = document.getElementById('moveForm');
const moveFolderSelect = document.getElementById('moveFolderSelect');
const confirmMoveBtn = document.getElementById('confirmMoveBtn');

// View state
let currentSelection = new Set(); // file ids
let folderDialogMode = 'create'; // or 'edit'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function renderRoleChips(viewRoles, editRoles) {
  const view = viewRoles.join(', ');
  const edit = editRoles.join(', ');
  return `<span class="badge">${view} / ${edit}</span>`;
}

function buildRoleCheckboxes(container, name, selectedRoles) {
  container.innerHTML = '';
  ROLES.forEach((role) => {
    const id = `${name}_${role}`;
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" id="${id}" value="${role}" ${selectedRoles.includes(role) ? 'checked' : ''}/> ${role}`;
    container.appendChild(label);
  });
}

function getCheckedRoles(container) {
  return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map((c) => c.value);
}

function buildFolderOptions(selectEl, excludeId) {
  const state = getState();
  selectEl.innerHTML = '';
  state.folders.forEach((f) => {
    if (excludeId && f.id === excludeId) return;
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.name;
    selectEl.appendChild(opt);
  });
}

function getFolderPath(folderId) {
  const state = getState();
  const parts = [];
  let cur = state.folders.find((f) => f.id === folderId);
  while (cur) {
    parts.unshift(cur.name);
    cur = cur.parentId ? state.folders.find((f) => f.id === cur.parentId) : null;
  }
  return parts.join(' / ');
}

// Renderers
function renderFolderTree() {
  const state = getState();
  const treeRoot = document.createDocumentFragment();
  const byParent = new Map();
  state.folders.forEach((f) => {
    const list = byParent.get(f.parentId) || [];
    list.push(f);
    byParent.set(f.parentId, list);
  });

  function renderLevel(parentId, depth) {
    const items = byParent.get(parentId) || [];
    items.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    items.forEach((f) => {
      const node = document.createElement('div');
      node.className = `tree-node ${state.selectedFolderId === f.id ? 'active' : ''}`;
      node.dataset.id = f.id;
      node.innerHTML = `
        <span class="tree-indent" style="padding-left:${depth * 12}px"></span>
        <span class="tree-toggle">📁</span>
        <span class="tree-name">${f.name}</span>
        <span class="tree-meta">${f.uploadRoles.join(', ')} 업로드</span>
      `;
      node.addEventListener('click', () => {
        setState((draft) => {
          draft.selectedFolderId = f.id;
          return draft;
        });
        currentSelection.clear();
        selectAllCheckbox.checked = false;
        refreshAll();
      });
      treeRoot.appendChild(node);
      renderLevel(f.id, depth + 1);
    });
  }

  folderTree.innerHTML = '';
  renderLevel(null, 0);
  folderTree.appendChild(treeRoot);
}

function renderFileTable() {
  const state = getState();
  const role = state.currentRole;
  const query = (searchInput.value || '').toLowerCase();
  const rows = state.files.filter((file) => file.folderId === state.selectedFolderId)
    .filter((file) => canViewFile(role, file))
    .filter((file) => file.name.toLowerCase().includes(query));

  fileTableBody.innerHTML = '';
  rows.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  rows.forEach((file) => {
    const tr = document.createElement('tr');
    tr.className = 'file-row';
    tr.dataset.id = file.id;
    tr.innerHTML = `
      <td><input type="checkbox" class="rowCheck" ${currentSelection.has(file.id) ? 'checked' : ''} /></td>
      <td>${file.name}</td>
      <td>${file.type}</td>
      <td>${formatBytes(file.size)}</td>
      <td>${new Date(file.uploadedAt).toLocaleString()}</td>
      <td>${file.ownerRole}</td>
      <td>${renderRoleChips(file.viewRoles, file.editRoles)}</td>
    `;

    tr.addEventListener('click', (e) => {
      if (e.target.closest('input[type="checkbox"]')) return;
      showInfoForFile(file.id);
    });
    tr.querySelector('.rowCheck').addEventListener('change', (e) => {
      if (e.target.checked) currentSelection.add(file.id);
      else currentSelection.delete(file.id);
      updateToolbarState();
    });

    fileTableBody.appendChild(tr);
  });

  selectAllCheckbox.checked = rows.length > 0 && rows.every((r) => currentSelection.has(r.id));
  updateToolbarState();
}

function showInfoForFolder(folderId) {
  const state = getState();
  const role = state.currentRole;
  const folder = state.folders.find((f) => f.id === folderId);
  const files = state.files.filter((file) => file.folderId === folderId && canViewFile(role, file));
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  infoPanel.innerHTML = `
    <div class="info-block">
      <div class="kv">
        <div class="k">폴더 경로</div><div class="v">${getFolderPath(folderId)}</div>
        <div class="k">폴더 명</div><div class="v">${folder.name}</div>
        <div class="k">설명</div><div class="v">${folder.description || '-'}</div>
        <div class="k">업로드 권한</div><div class="v">${folder.uploadRoles.join(', ')}</div>
        <div class="k">파일 수</div><div class="v">${files.length}</div>
        <div class="k">총 크기</div><div class="v">${formatBytes(totalSize)}</div>
        <div class="k">생성일</div><div class="v">${new Date(folder.createdAt).toLocaleString()}</div>
      </div>
    </div>
  `;
}

function showInfoForFile(fileId) {
  const state = getState();
  const file = state.files.find((f) => f.id === fileId);
  infoPanel.innerHTML = `
    <div class="info-block">
      <div class="kv">
        <div class="k">파일 명</div><div class="v">${file.name}</div>
        <div class="k">형식</div><div class="v">${file.type}</div>
        <div class="k">크기</div><div class="v">${formatBytes(file.size)}</div>
        <div class="k">업로드일</div><div class="v">${new Date(file.uploadedAt).toLocaleString()}</div>
        <div class="k">소유자</div><div class="v">${file.ownerRole}</div>
        <div class="k">권한</div><div class="v">보기: ${file.viewRoles.join(', ')} | 편집: ${file.editRoles.join(', ')}</div>
        <div class="k">위치</div><div class="v">${getFolderPath(file.folderId)}</div>
      </div>
    </div>
  `;
}

function updateToolbarState() {
  const state = getState();
  const folder = state.folders.find((f) => f.id === state.selectedFolderId);
  const role = state.currentRole;
  const canUpload = canUploadToFolder(role, folder);
  const selectionFiles = state.files.filter((f) => currentSelection.has(f.id));
  const canMove = selectionFiles.length > 0 && selectionFiles.every((f) => canEditFile(role, f));
  const canDelete = canMove;
  uploadBtn.disabled = !canUpload;
  moveBtn.disabled = !canMove;
  deleteFileBtn.disabled = !canDelete;
}

function refreshAll() {
  const state = getState();
  roleSelect.value = state.currentRole;
  renderFolderTree();
  renderFileTable();
  showInfoForFolder(state.selectedFolderId);
}

// Event handlers
roleSelect.addEventListener('change', (e) => {
  setState((draft) => { draft.currentRole = e.target.value; return draft; });
  refreshAll();
});

resetDataBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  currentSelection.clear();
  refreshAll();
});

addFolderBtn.addEventListener('click', () => {
  folderDialogMode = 'create';
  folderDialogTitle.textContent = '폴더 추가';
  folderNameInput.value = '';
  folderDescInput.value = '';
  buildRoleCheckboxes(folderUploadRolesContainer, 'folderUpload', ['Admin', 'Editor']);
  folderDialog.showModal();
});

editFolderBtn.addEventListener('click', () => {
  const state = getState();
  const folder = state.folders.find((f) => f.id === state.selectedFolderId);
  if (!folder) return;
  folderDialogMode = 'edit';
  folderDialogTitle.textContent = '폴더 수정';
  folderNameInput.value = folder.name;
  folderDescInput.value = folder.description || '';
  buildRoleCheckboxes(folderUploadRolesContainer, 'folderUpload', folder.uploadRoles);
  folderDialog.showModal();
});

deleteFolderBtn.addEventListener('click', () => {
  const state = getState();
  const currentId = state.selectedFolderId;
  const hasChildren = state.folders.some((f) => f.parentId === currentId);
  const hasFiles = state.files.some((f) => f.folderId === currentId);
  if (state.folders.find((f) => f.id === currentId)?.parentId === null) {
    alert('루트 폴더는 삭제할 수 없습니다.');
    return;
  }
  if (hasChildren || hasFiles) {
    const ok = confirm('하위 폴더 또는 파일이 있습니다. 모두 함께 삭제하시겠습니까?');
    if (!ok) return;
  }
  setState((draft) => {
    const removeIds = new Set([currentId]);
    // remove descendants
    let changed = true;
    while (changed) {
      changed = false;
      draft.folders.forEach((f) => {
        if (f.parentId && removeIds.has(f.parentId) && !removeIds.has(f.id)) { removeIds.add(f.id); changed = true; }
      });
    }
    draft.folders = draft.folders.filter((f) => !removeIds.has(f.id));
    draft.files = draft.files.filter((fi) => !removeIds.has(fi.folderId));
    const fallback = draft.folders.find((f) => f.parentId === null)?.id;
    draft.selectedFolderId = fallback || (draft.folders[0]?.id ?? null);
    return draft;
  });
  currentSelection.clear();
  refreshAll();
});

folderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const uploadRoles = getCheckedRoles(folderUploadRolesContainer);
  if (uploadRoles.length === 0) {
    alert('업로드 권한은 최소 1개 이상 선택해야 합니다.');
    return;
  }
  if (folderDialogMode === 'create') {
    const name = folderNameInput.value.trim();
    if (!name) return;
    setState((draft) => {
      const id = crypto.randomUUID();
      draft.folders.push({ id, name, description: folderDescInput.value.trim(), parentId: draft.selectedFolderId, uploadRoles, createdAt: Date.now() });
      draft.selectedFolderId = id;
      return draft;
    });
  } else {
    setState((draft) => {
      const f = draft.folders.find((x) => x.id === draft.selectedFolderId);
      if (f) {
        f.name = folderNameInput.value.trim();
        f.description = folderDescInput.value.trim();
        f.uploadRoles = uploadRoles;
      }
      return draft;
    });
  }
  folderDialog.close();
  refreshAll();
});

uploadBtn.addEventListener('click', () => {
  const state = getState();
  const folder = state.folders.find((f) => f.id === state.selectedFolderId);
  if (!canUploadToFolder(state.currentRole, folder)) {
    alert('업로드 권한이 없습니다.');
    return;
  }
  buildRoleCheckboxes(viewRolesContainer, 'viewRoles', ['Admin', 'Editor', 'Viewer']);
  buildRoleCheckboxes(editRolesContainer, 'editRoles', ['Admin', 'Editor']);
  fileInput.value = '';
  uploadDialog.showModal();
});

uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const files = Array.from(fileInput.files || []);
  const viewRoles = getCheckedRoles(viewRolesContainer);
  const editRoles = getCheckedRoles(editRolesContainer);
  if (files.length === 0) return uploadDialog.close();
  if (viewRoles.length === 0) { alert('보기 권한은 최소 1개 이상 선택하세요.'); return; }
  if (editRoles.length === 0) { alert('편집 권한은 최소 1개 이상 선택하세요.'); return; }
  setState((draft) => {
    const folderId = draft.selectedFolderId;
    files.forEach((f) => {
      draft.files.push({
        id: crypto.randomUUID(),
        folderId,
        name: f.name,
        type: f.type || inferTypeFromName(f.name),
        size: f.size || 0,
        uploadedAt: Date.now(),
        ownerRole: getState().currentRole,
        viewRoles: [...viewRoles],
        editRoles: [...editRoles],
      });
    });
    return draft;
  });
  uploadDialog.close();
  refreshAll();
});

function inferTypeFromName(name) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (!ext) return 'file';
  if (['png','jpg','jpeg','gif','webp','bmp','svg'].includes(ext)) return 'image';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc','docx'].includes(ext)) return 'word';
  if (['xls','xlsx','csv'].includes(ext)) return 'excel';
  if (['ppt','pptx'].includes(ext)) return 'ppt';
  if (['txt','md'].includes(ext)) return 'text';
  return ext;
}

moveBtn.addEventListener('click', () => {
  const state = getState();
  const selectionFiles = state.files.filter((f) => currentSelection.has(f.id));
  if (selectionFiles.length === 0) return;
  // 편집 권한 확인
  if (!selectionFiles.every((f) => canEditFile(state.currentRole, f))) {
    alert('선택된 파일 중 이동 권한이 없는 파일이 있습니다.');
    return;
  }
  buildFolderOptions(moveFolderSelect, null);
  moveFolderSelect.value = state.selectedFolderId;
  moveDialog.showModal();
});

moveForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const targetFolderId = moveFolderSelect.value;
  setState((draft) => {
    draft.files.forEach((f) => {
      if (currentSelection.has(f.id)) f.folderId = targetFolderId;
    });
    return draft;
  });
  moveDialog.close();
  currentSelection.clear();
  refreshAll();
});

deleteFileBtn.addEventListener('click', () => {
  const state = getState();
  const selectionFiles = state.files.filter((f) => currentSelection.has(f.id));
  if (selectionFiles.length === 0) return;
  if (!selectionFiles.every((f) => canEditFile(state.currentRole, f))) {
    alert('선택된 파일 중 삭제 권한이 없는 파일이 있습니다.');
    return;
  }
  const ok = confirm(`${selectionFiles.length}개 파일을 삭제하시겠습니까?`);
  if (!ok) return;
  setState((draft) => {
    draft.files = draft.files.filter((f) => !currentSelection.has(f.id));
    return draft;
  });
  currentSelection.clear();
  refreshAll();
});

refreshBtn.addEventListener('click', () => refreshAll());
searchInput.addEventListener('input', () => renderFileTable());
selectAllCheckbox.addEventListener('change', () => {
  const state = getState();
  const role = state.currentRole;
  const query = (searchInput.value || '').toLowerCase();
  const rows = state.files.filter((file) => file.folderId === state.selectedFolderId)
    .filter((file) => canViewFile(role, file))
    .filter((file) => file.name.toLowerCase().includes(query));
  if (selectAllCheckbox.checked) {
    rows.forEach((r) => currentSelection.add(r.id));
  } else {
    rows.forEach((r) => currentSelection.delete(r.id));
  }
  renderFileTable();
});

// 초기 렌더
refreshAll();

