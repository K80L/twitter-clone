import useAuthContext from '../../hooks/useAuthContext';

export default function Home() {
  const { user, logout } = useAuthContext();
  return (
    <div>
      <p>Hello {user!.username}</p>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
