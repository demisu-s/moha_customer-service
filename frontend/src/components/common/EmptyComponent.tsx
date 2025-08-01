import Empty from "../../assets/Empty.svg";

interface EmptyComponentProps {
  headerText?: string;
  mainText?: string;
}

export const EmptyComponent = ({ headerText, mainText }: EmptyComponentProps) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-4">
      <img
        src={Empty}
        alt="Empty"
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto mb-6"
      />
      <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-2 text-center">
        {headerText === undefined ? "You don't have data!" : headerText}
      </p>
      <p className="text-sm sm:text-base text-gray-500 mb-6 text-center">
        {
          mainText === undefined ? "when you add some data it will appear here." : mainText
        }
      </p>
    </div>
  );
}

export default EmptyComponent;
