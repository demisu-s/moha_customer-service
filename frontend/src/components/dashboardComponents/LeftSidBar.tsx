
export const LeftSideBar = () => {

  

 

  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-xl font-semibold mb-4">Left Side Bar</h2>
      <ul className="space-y-2">
        <li><a href="#dashboard" className="text-blue-600 hover:underline">Dashboard</a></li>
        <li><a href="#settings" className="text-blue-600 hover:underline">Settings</a></li>
        <li><a href="#profile" className="text-blue-600 hover:underline">Profile</a></li>
      </ul>
    </div>
  );
};
