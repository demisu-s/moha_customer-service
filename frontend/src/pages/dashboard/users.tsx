// src/pages/UserManagement.tsx
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext"; // <-- New import

export default function UserManagement(): JSX.Element {
  const { users } = useUserContext(); // <-- Get users from context
  const [search, setSearch] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [areaFilter, setAreaFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 10;

  const navigate = useNavigate();

  const filteredUsers = users.filter((user) => {
    const nameMatch = `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const departmentMatch = departmentFilter ? user.department === departmentFilter : true;
    const areaMatch = areaFilter ? user.area === areaFilter : true;
    const roleMatch = roleFilter ? user.role === roleFilter : true;
    return nameMatch && departmentMatch && areaMatch && roleMatch;
  });

  const totalUsers = filteredUsers.length;
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage, totalUsers);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    if (startIndex >= filteredUsers.length && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredUsers, currentPage, startIndex]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 pb-1">User Management</h1>
        <p className="text-sm text-gray-400">Manage users, roles, and departments efficiently.</p>
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

          {/* Filter Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="px-3 py-2 border rounded-md text-sm hover:bg-gray-100">
                Filter
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white shadow-lg border rounded-md p-2 w-56 space-y-2">
                {/* Department Filter */}
                <div>
                  <label className="text-xs text-gray-500">Department</label>
                  <select
                    className="w-full border mt-1 px-2 py-1 rounded text-sm"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="MIS">MIS</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                {/* Area Filter */}
                <div>
                  <label className="text-xs text-gray-500">Area</label>
                  <select
                    className="w-full border mt-1 px-2 py-1 rounded text-sm"
                    value={areaFilter}
                    onChange={(e) => setAreaFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="HO">HO</option>
                    <option value="Kality">Kality</option>
                    <option value="Summit">Summit</option>
                  </select>
                </div>

                {/* Role Filter */}
                <div>
                  <label className="text-xs text-gray-500">Role</label>
                  <select
                    className="w-full border mt-1 px-2 py-1 rounded text-sm"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="Admin">Admin</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="User">User</option>
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
              <th className="px-4 py-2">Area</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-lg">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, idx) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{startIndex + idx + 1}</td>
                  <td className="px-4 py-2">{user.firstName}</td>
                  <td className="px-4 py-2">{user.lastName}</td>
                  <td className="px-4 py-2">{user.area}</td>
                  <td className="px-4 py-2">{user.department}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button className="text-blue-600 hover:underline">
                      <Pencil1Icon className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:underline">
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
        <span>
          Showing {totalUsers === 0 ? 0 : startIndex + 1}–{endIndex} of {totalUsers} users
        </span>

        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded-md ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => (endIndex < totalUsers ? prev + 1 : prev))
            }
            disabled={endIndex >= totalUsers}
            className={`px-3 py-1 border rounded-md ${
              endIndex >= totalUsers ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
