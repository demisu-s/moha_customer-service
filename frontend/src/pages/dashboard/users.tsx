import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { JSX, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

export default function UserManagement(): JSX.Element {
  const {
    users,
    deleteUserHandler,
    plants,
    departments,
    roles,
    loadDepartments,
  } = useUserContext();

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [plantFilter, setPlantFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [showDialog, setShowDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  /* -------------------- Load Departments on Plant Change -------------------- */
  useEffect(() => {
    if (plantFilter) loadDepartments(plantFilter);
    else setDepartmentFilter("");
  }, [plantFilter, loadDepartments]);

  /* -------------------- Filtered Departments -------------------- */
  const filteredDepartments = useMemo(() => {
    if (!plantFilter) return departments;
    return departments.filter((dept) => dept.plant === plantFilter);
  }, [departments, plantFilter]);

  /* -------------------- Filtering Users -------------------- */
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const nameMatch = `${user.firstName ?? ""} ${user.lastName ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const departmentMatch = departmentFilter
        ? user.department?.name === departmentFilter
        : true;

      const plantMatch = plantFilter
        ? user.department?.plant === plantFilter
        : true;

      const roleMatch = roleFilter ? user.role === roleFilter : true;

      return nameMatch && departmentMatch && plantMatch && roleMatch;
    });
  }, [users, search, departmentFilter, plantFilter, roleFilter]);

  /* -------------------- Pagination -------------------- */
  const totalUsers = filteredUsers.length;
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage, totalUsers);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  if (startIndex >= filteredUsers.length && currentPage !== 1) {
    setCurrentPage(1);
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 pb-1">User Management</h1>
        <p className="text-sm text-gray-400">
          Manage users, roles, and departments efficiently.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <div className="flex items-center gap-2 w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="px-3 py-2 border rounded-md text-sm hover:bg-gray-100">
                Filter
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white shadow-lg border rounded-md p-2 w-56 space-y-2">
                {/* Plant */}
                <div>
                  <label className="text-xs text-gray-500">Plant</label>
                  <select
                    className="w-full border mt-1 px-2 py-1 rounded text-sm"
                    value={plantFilter}
                    onChange={(e) => setPlantFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    {plants.map((plant) => (
                      <option key={plant._id} value={plant._id}>
                        {plant.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="text-xs text-gray-500">Department</label>
                  <select
                    className="w-full border mt-1 px-2 py-1 rounded text-sm"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    disabled={!plantFilter}
                  >
                    <option value="">All</option>
                    {filteredDepartments.map((dept) => (
                      <option key={dept._id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label className="text-xs text-gray-500">Role</label>
                  <select
                    className="w-full border mt-1 px-2 py-1 rounded text-sm"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        <button
          className="bg-black text-white px-4 py-2 rounded-md text-sm hover:shadow-md hover:scale-105 hover:bg-gray-400 transition duration-200"
          onClick={() => navigate("/dashboard/users/adduser")}
        >
          + Add user
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left font-bold text-lg">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Plant</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>

          <tbody className="text-lg">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, idx) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-2">{startIndex + idx + 1}</td>
                  <td className="px-4 py-2">{user.firstName ?? "-"}</td>
                  <td className="px-4 py-2">{user.lastName ?? "-"}</td>
             <td className="px-4 py-2">{user.department?.plant?.name ?? "-"}</td>
             <td className="px-4 py-2">{user.department?.name ?? "-"}</td>

                  <td className="px-4 py-2">{user.role ?? "-"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => navigate(`/dashboard/users/edit/${user._id}`)}
                    >
                      <Pencil1Icon className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => {
                        setUserToDelete(user._id);
                        setShowDialog(true);
                      }}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center px-4 py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg mb-4">
              Are you sure you want to delete this user?
            </h2>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-black text-white"
                onClick={() => {
                  if (userToDelete) deleteUserHandler(userToDelete);
                  setShowDialog(false);
                  setUserToDelete(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
        <span>
          Showing {totalUsers === 0 ? 0 : startIndex + 1}–{endIndex} of {totalUsers} users
        </span>

        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => (endIndex < totalUsers ? prev + 1 : prev))}
            disabled={endIndex >= totalUsers}
            className="px-3 py-1 border rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
