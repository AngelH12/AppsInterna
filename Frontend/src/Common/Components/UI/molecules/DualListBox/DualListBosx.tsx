import { MoveRight } from "lucide-react";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { BasicButton } from "../../Atoms";

export interface optionsDualBox {
  label: string;
  value: string;
}

interface props {
  options: optionsDualBox[];
  selectedOptions: string[];
  setSelectedOptions: (e: string[]) => void;

  rightHeader?: string;
  leftHeader?: string;
}

export const DualBoxSelect: React.FC<props> = ({
  options,
  selectedOptions,
  setSelectedOptions,
  rightHeader,
  leftHeader,
}) => {
  const DualListBoxComponent = DualListBox as any;

  return (
    <div>
      <div className=" grid grid-cols-2 gap-x-14 max-[575px]:grid-cols-1">
        <p className="">{leftHeader}</p>
        <p className=" hidden min-[575px]:block ">{rightHeader}</p>
      </div>
      <DualListBoxComponent
        options={options}
        selected={selectedOptions}
        onChange={(e: string[]) => setSelectedOptions(e)}
        icons={{
          moveLeft: <span className="mdi mdi-chevron-left" key="moveLeft" />,
          moveAllLeft: [
            <span className="mdi mdi-chevron-double-left" key="key" />,
          ],
          moveRight: (
            <BasicButton
              onClick={() => {
                console.log("move right");
              }}
              type="button"
            >
              <MoveRight />
            </BasicButton>
          ),
          moveAllRight: [
            <span className="mdi mdi-chevron-double-right" key="key" />,
          ],
          moveDown: <span className="mdi mdi-chevron-down" key="key" />,
          moveUp: <span className="mdi mdi-chevron-up" key="key" />,
          moveTop: <span className="mdi mdi-chevron-double-up" key="key" />,
          moveBottom: (
            <span className="mdi mdi-chevron-double-down" key="key" />
          ),
        }}
      />
      <div className="flex flex-row justify-between w-full h-auto">
        <p className="block min-[575px]:hidden ">{rightHeader}</p>
      </div>
    </div>
  );
};
