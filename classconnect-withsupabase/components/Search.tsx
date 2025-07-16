import React, { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";

// const person = {
//     name: "John",
//     age: 36,
//     location: 'gotham city'
// }
//  De structure the object ^
// const {name, age, location} = person;
// de structures the props given through the values in its called component function
interface SearchProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  className?: string; // Make className optional with '?'
}

const Search: React.FC<SearchProps> = ({ searchTerm, setSearchTerm }) => {
  const clearSearchTerm = () => {
    setSearchTerm("");
  };

  return (
    <div className="flex w-full mx-auto justify-center">
      <input
        className="bg-gray-300 w-full px-4 py-3 rounded-lg max-w-3xl"
        type="text"
        placeholder="Search Teachers/Classes/Styles"
        value={searchTerm}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(event.target.value)
        }
      />
      <Button
        variant="secondary"
        className="bg-gray-400 hover:bg-gray-500 hover:font-bold my-auto cursor-pointer"
        onClick={clearSearchTerm}
      >
        Clear
      </Button>
    </div>
  );
};

export default Search;
