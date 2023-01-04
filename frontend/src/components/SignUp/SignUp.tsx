import { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import useAuthContext from '../../hooks/useAuthContext';
import './styles.css';

export default function SignUp() {
  const { signup, isLoading, error } = useAuthContext();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    signup({
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      {error && <p className={'error'}>Sign up error!</p>}

      <label>
        Username
        <input name="username" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>

      {/*
        While the network request is in progress,
        we disable the button. You can always add
        more stuff, like loading spinners and whatnot.
      */}
      <button disabled={isLoading}>Submit</button>

      <Link to="/login">Login</Link>
    </form>
  );
}
