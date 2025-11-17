// auth.js - sistema de login / cadastro / menu

// utils
function $(id){ return document.getElementById(id); }

// AUTH CORE
const auth = {
  saveUser: (user, pass, age) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[user]) return false;
    users[user] = { password: pass, age: age };
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  },

  checkLogin: (user, pass) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[user]) return false;
    return users[user].password === pass;
  },

  setSession: (user) => {
    localStorage.setItem('session_user', user);
  },

  getSession: () => {
    return localStorage.getItem('session_user');
  },

  logout: () => {
    localStorage.removeItem('session_user');
  }
};

//////////////////////////////////////////////////////////
// LOGIN PAGE
//////////////////////////////////////////////////////////
if (document.body.classList.contains('bg-login')) {
  const btnLogin = $('btnLogin');
  const loginUser = $('loginUser');
  const loginPass = $('loginPass');

  btnLogin?.addEventListener('click', () => {
    const u = loginUser.value.trim(), p = loginPass.value.trim();
    if (!u || !p) { alert('Preencha usuário e senha'); return; }

    if (auth.checkLogin(u, p)) {
      auth.setSession(u);
      window.location.href = 'menu.html';
    } else {
      alert('Usuário ou senha inválidos');
    }
  });

  $('forgotLink')?.addEventListener('click', () => {
    alert('Recuperação de senha não implementada (demo). Use cadastro novo.');
  });
}

//////////////////////////////////////////////////////////
// SIGNUP PAGE
//////////////////////////////////////////////////////////
if (document.getElementById('signupForm')) {
  const su = $('suUser'), sp = $('suPass'), sa = $('suAge'), btn = $('btnSignup');

  btn.addEventListener('click', () => {
    const u = su.value.trim(), p = sp.value.trim(), age = sa.value.trim();

    if (!u || !p || !age) {
      alert('Preencha todos os campos');
      return;
    }
    if (isNaN(Number(age))) {
      alert('Idade precisa ser numérica');
      return;
    }

    if (auth.saveUser(u, p, age)) {
      alert('Conta criada! Faça login.');
      window.location.href = 'index.html';
    } else {
      alert('Usuário já existe!');
    }
  });
}

//////////////////////////////////////////////////////////
// MENU PAGE
//////////////////////////////////////////////////////////
if (document.body.classList.contains('bg-menu')) {
  const menuUser = $('menuUser'),
        btnStart = $('btnStart'),
        btnLogout = $('btnLogout'),
        bgSelect = $('bgSelect'),
        charSelect = $('charSelect');

  const user = auth.getSession();
  if (!user) window.location.href = 'index.html';

  menuUser.innerText = user;

  btnLogout.addEventListener('click', () => {
    auth.logout();
    window.location.href = 'index.html';
  });

  btnStart.addEventListener('click', () => {
    localStorage.setItem('selected_bg', bgSelect.value);
    localStorage.setItem('selected_char', charSelect.value);
    window.location.href = 'game.html';
  });
}
