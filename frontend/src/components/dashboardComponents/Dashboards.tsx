import { CardComponent } from './CardComponent';



export const Dashboards = () => {
  return (
    <div className="max-w-full md:max-w-full flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button className="text-lg font-semibold px-4 py-2 border-b-4 border-main-color">
            Buy
          </button>
          <button className="text-lg font-semibold px-4 py-2 text-gray-500">
            Rent
          </button>
        </div>
      </div>
      <div className="rounded-lg h-full overflow-auto">
        <CardComponent />
      </div>
    </div>
  );
};
