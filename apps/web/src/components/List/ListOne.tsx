import React from "react";

type ListItem = {
  text: string;
};

const listItems: ListItem[] = [
  { text: "Lorem ipsum dolor sit amet" },
  { text: "It is a long established fact reader" },
  { text: "The point of using Lorem Ipsum" },
  { text: "There are many variations of passages" },
  { text: "If you are going to use a of Lorem" },
];

export const ListOne: React.FC = () => {
  return (
    <div className="min-w-[370px] max-w-max rounded-md border border-stroke py-1 dark:border-strokedark">
      <ul className="flex flex-col">
        {listItems.map((item, index) => (
          <li
            key={item.text}
            className="flex items-center gap-2.5 border-b border-stroke px-5 py-3 last:border-b-0 dark:border-strokedark"
          >
            <span className="flex h-6.5 w-full max-w-6.5 items-center justify-center rounded-full bg-primary text-white">
              {index + 1}
            </span>
            <span> {item.text} </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
