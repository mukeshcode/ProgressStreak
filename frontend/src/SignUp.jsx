const SignUp = () => {

  async function postUser(data) {
    try {
      const res = await fetch("http://127.0.0.1:3000/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData['msg']);
        throw new Error(errorData['msg']);
      }

      const resData = await res.json();
      console.log("Data received : ", resData, "\n Signup successful")
    } catch (err) {
      console.log("Error : ", err);
    }

  }

  async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const data = {
      username: username,
      password: password
    };
    let res = await postUser(data);
  }

  return (
    <div>
      <form>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button onClick={handleSignup}>Create an Account</button>
      </form>
    </div>
  );
}

export default SignUp;