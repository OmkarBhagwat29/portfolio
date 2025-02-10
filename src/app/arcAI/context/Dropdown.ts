export interface DopdownProps {
  title: string;
  ReactComponent?: React.ElementType;
  submenus?: DopdownProps[];
  isSelected?: boolean;
}

const menus: DopdownProps[] = [
  {
    title: "Views",
    submenus: [
      {
        title: "perspective",
      },
      {
        title: "orthographic",
      },
      {
        title: "top",
      },
      {
        title: "front",
      },
      {
        title: "back",
      },
      {
        title: "left",
      },
      {
        title: "right",
      },
    ],
  },
  {
    title: "Display",
    submenus: [
      {
        title: "shaded",
      },
      {
        title: "wireframe",
      },
      {
        title: "rendered",
        submenus: [
          {
            title: "mat",
          },
          {
            title: "glossy",
          },
        ],
      },
    ],
  },
  {
    title: "import",
  },
];

export const viewportDropDownData: DopdownProps[] = menus;
