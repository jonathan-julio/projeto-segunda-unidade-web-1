import UserService from './services/userService.js';
import AdminService from './services/adminService.js';
import { isConnected, loadHeader, formatarData } from './utils.js';

loadHeader();
const users = [];
const role = localStorage.getItem('role');

document.addEventListener("DOMContentLoaded", async function () {
    isConnected();
    await loadUsers();

    document.getElementById('logForm').addEventListener('submit', handleFormSubmit(getLogs, 'logUserSelect', 'logTextarea'));
    document.getElementById('blockedForm').addEventListener('submit', handleFormSubmit(getBlocked, null, 'blockedTextarea'));

    if (role === "ADMIN" || role === "MODERADOR") {
        addAdminForms();
    }
});

async function loadUsers() {
    try {
        const response = await UserService.fetchUsers();
        const data = await response.json();
        users.push(...data);
        populateUserSelect("logUserSelect");
        populateUserSelect("permissionUserSelect");
        populateUserSelect("accessUserSelect");
        populateUserSelect("passwordUserSelect");
    } catch (error) {
        console.error(error);
    }
}

function populateUserSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.text = user.login;
        select.add(option);
    });
}

function handleFormSubmit(callback, userSelectId, textareaId) {
    return async function (e) {
        e.preventDefault();
        const userId = userSelectId ? document.getElementById(userSelectId).value : null;
        await callback(userId, textareaId);
    }
}

async function getLogs(userId, textareaId) {
    if (!userId) {
        showAlert('Nenhum usuario selecionado', 'danger');
        return;
    }
    try {
        const response = await AdminService.fetchLogs(userId);
        const data = await response.json();
        const logTexts = data.map(log => `Changer ${log.id}: ${log.changer}, \nData: ${formatarData(log.data)}\nFunction: ${log.function}\n\n`);
        document.getElementById(textareaId).value = logTexts.join('');
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

async function getBlocked(_, textareaId) {
    try {
        const response = await AdminService.fetchBlocked();
        const data = await response.json();
        const blockedTexts = data.map(blocked => `ID usuario : ${blocked.id}\nLogin : ${blocked.login} \nNome: ${blocked.person.nome}\n\n`);
        document.getElementById(textareaId).value = blockedTexts.join('');
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

function addAdminForms() {
    const adminForms = document.getElementById("adminForms");
    adminForms.innerHTML = `
        <div class="col-lg-4  p-2">
            <form id="permissionForm" class="dadosPortfolio">
                <fieldset class="border pt-4 px-4 pb-5">
                    <legend class="w-auto">Alterar permissões</legend>
                    <div class="d-flex justify-content-start">Selecione o usuario:*</div>
                    <select id="permissionUserSelect" class="form-control"></select>
                    <div class="d-flex justify-content-start">Selecione a permissão:*</div>
                    <select id="permissionSelect" class="form-control">
                        <option value="">Selecione</option>
                        <option value="MODERADOR">MODERADOR</option>
                        <option value="USER">USER</option>
                        <option value="ESPECIAL">ESPECIAL</option>
                    </select>
                    <div class="text-center pt-4">
                        <button type="submit" class="btn btn-dark">Alterar</button>
                    </div>
                </fieldset>
            </form>
        </div>
        <div class="col-lg-4  p-2">
            <form id="accessForm" class="dadosPortfolio">
                <fieldset class="border pt-4 px-4 pb-5">
                    <legend class="w-auto">Alterar acesso</legend>
                    <div class="d-flex justify-content-start">Selecione o usuario:*</div>
                    <select id="accessUserSelect" class="form-control"></select>
                    <div class="d-flex justify-content-start">Selecione o acesso:*</div>
                    <select id="accessSelect" class="form-control">
                        <option value="LIBERADO">LIBERAR</option>
                        <option value="BLOQUEADO">BLOQUEAR</option>
                    </select>
                    <div class="text-center pt-4">
                        <button type="submit" class="btn btn-dark">Alterar</button>
                    </div>
                </fieldset>
            </form>
        </div>
        <div class="col-lg-4  p-2 ">
            <form id="passwordForm" class="dadosPortfolio">
                <fieldset class="border pt-4 px-4">
                    <legend class="w-auto">Alterar senha</legend>
                    <div class="d-flex justify-content-start">Selecione o usuario:*</div>
                    <select id="passwordUserSelect" class="form-control"></select>
                    <div class="form-group justify-content-start">
                        <label class="d-flex justify-content-start" for="newPassword">Nova Senha</label>
                        <input type="password" id="newPassword" class="form-control" required />
                    </div>
                    <div class="form-group">
                        <label class="d-flex justify-content-start" for="confirmPassword">Confirme a nova senha</label>
                        <input type="password" id="confirmPassword" class="form-control" required />
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn btn-dark m-1">Alterar</button>
                    </div>
                </fieldset>
            </form>
        </div>
    `;

    document.getElementById('permissionForm').addEventListener('submit', handleFormSubmit(setRole, 'permissionUserSelect', null));
    document.getElementById('accessForm').addEventListener('submit', handleFormSubmit(setAccess, 'accessUserSelect', null));
    document.getElementById('passwordForm').addEventListener('submit', handleFormSubmit(setPassword, 'passwordUserSelect', null));
}

async function setRole(userId) {
    const permissao = document.getElementById('permissionSelect').value;
    if (userId && permissao) {
        try {
            const response = await AdminService.postPermissao({ usuarioID: userId, tipo: permissao });
            if (response.status === 200) {
                showAlert('Permissão alterada com sucesso.', "success");
            } else {
                const data = await response.json();
                showAlert(data.errors, 'danger');
            }
        } catch (error) {
            showAlert(error.message, 'danger');
        }
    } else {
        showAlert('Nenhum usuario e/ou permissão selecionado', 'danger');
    }
}

async function setAccess(userId) {
    const acesso = document.getElementById('accessSelect').value;
    if (userId && acesso) {
        try {
            const response = await AdminService.postAcesso({ usuarioID: userId, acesso: acesso });
            if (response.status === 200) {
                showAlert('Acesso alterado com sucesso.', 'success');
            } else {
                const data = await response.json();
                showAlert(data.errors, 'danger');
            }
        } catch (error) {
            showAlert(error.message, 'danger');
        }
    } else {
        showAlert('Nenhum usuario e/ou acesso selecionado', 'danger');
    }
}

async function setPassword(userId) {
    if (!checkVariables()) {
        return;
    }
    const password = document.getElementById('newPassword').value;
    try {
        const response = await AdminService.patchPasswordAdmin({ usuarioID: userId, password: password });
        if (response.status === 200) {
            showAlert('Senha alterada com sucesso.', 'success');
        } else {
            const data = await response.json();
            showAlert(data.errors, 'danger');
        }
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

function checkVariables() {
    const password = document.getElementById('newPassword').value;
    const checkPassword = document.getElementById('confirmPassword').value;
    if (password !== checkPassword) {
        showAlert('Confirmação da senha inválida. Verifique novamente a nova senha.', 'danger');
        return false;
    }
    return true;
}
