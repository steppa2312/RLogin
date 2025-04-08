const UserRow = ({ user }) => (
    <tr>
      <td>{user.name || user.username}</td>
      <td>{user.role || user.ruolo}</td>
      <td>
        <button className="user-action-btn">Modifica</button>
      </td>
    </tr>
  );
  
  export default UserRow;