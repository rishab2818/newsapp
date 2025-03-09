import { useState } from "react";
import { Dropdown, Button } from "react-bootstrap";

const NEWS_CATEGORIES = [
  "All",
  "World",
  "Local",
  "National",
  "Technology",
  "Science",
  "Lifestyle",
];

const UPSC_CATEGORIES = [
  "All",
  "History",
  "Polity",
  "Geography",
  "Economy",
  "Science & Tech",
  "Ethics",
  "Essay",
  "International Relations",
];

const CategoryFilter = ({ setSelectedCategory, ctype }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const categories = ctype === "upsc" ? UPSC_CATEGORIES : NEWS_CATEGORIES;

  return (
    <div className="my-4">
      {/* Large Screens: Buttons */}
      <div className="d-none d-md-flex gap-2 flex-wrap justify-content-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline-primary"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Small Screens: Dropdown */}
      <div className="d-md-none text-center">
        <Dropdown
          show={showDropdown}
          onToggle={() => setShowDropdown(!showDropdown)}
        >
          <Dropdown.Toggle variant="primary">Select Category</Dropdown.Toggle>
          <Dropdown.Menu>
            {categories.map((category) => (
              <Dropdown.Item
                key={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default CategoryFilter;
