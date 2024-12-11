import React from "react";
import "../Header.css";
import SearchBar from "./SearchBar";

const Header = ({ onSearch, onFilterApply, categories, tags }) => {
  return (
    <div className="header">
      <div className="header-search">
        <SearchBar
          onSearch={onSearch}
          onFilterApply={onFilterApply}
          categories={categories}
          tags={tags}
        />
      </div>
    </div>
  );
};

export default Header;
