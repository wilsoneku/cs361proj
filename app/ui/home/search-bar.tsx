export default function SearchBar() {
    return (
        <div className="flex justify-center  max-w-[900px] min-w-[500px]  my-12">
            {/*SEARCH BAR*/}
            <input
                className="w-full rounded-md border-gray-300 focus:ring-1 focus:ring-gray-800"
                type="text"
                placeholder="Search in the Grand Exchange..."
            />
        </div>
    );
}