/**
 *  LOGIN FUNCTIONALITY
 */

/* eslint-disable */

// import axios from 'axios';

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      alert('Logged in Successfully');
      window.setTimeout(() => {
        //redirect to homepage
        location.assign('/');
      }, 1500);
    }

    // console.log('===============================>');
    // console.log(res);
    // console.log(res.data.status);
    // console.log('===============================>');

    console.log('===============================>');
    // console.log(res.data.status);
    console.log('===============================>');
  } catch (err) {
    alert(err.response.data.message);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});
