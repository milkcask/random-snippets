import { React, PropsWithChildren, ExportedIcon, clsx } from 'foo';

const isColouring = (cssValue?: string) => cssValue !== "none";
const toInherit = (colouring: boolean) => (colouring ? "inherit" : "none");

type InlineSVGIconProps = {
  icon: ExportedIcon;
  className?: string;
};

const InlineSVGIcon: React.FC<PropsWithChildren<InlineSVGIconProps>> = ({
  icon: [width, height, styles, curves],
  className,
  children,
}) => {
  
  const paths = curves.map((path, index) => {
    const pathProps = {
      strokeLinecap: styles[index]["stroke-linecap"],
      strokeLinejoin: styles[index]["stroke-linejoin"],
      strokeWidth: styles[index]["stroke-width"],
      stroke: toInherit(isColouring(styles[index].stroke)),
      fill: toInherit(isColouring(styles[index].fill)),
    };
    
    return (
      <path
      {...{
        ...pathProps,
        key: index,
        d: path,
      }}
      />
    );
  });
  
  return (
    <span className={clsx("inline-flex align-baseline", className)}>
      <svg
      viewBox="0 0 1680 1680"
      className={clsx(
        "w-[1em] h-[1em] inline-block align-baseline translate-y-[0.1em]",
        isColouring(styles[0].fill) && "fill-current",
        isColouring(styles[0].stroke) && "stroke-current"
      )}
      width={1680}
      height={1680}
      aria-hidden="true"
      >
        <g transform={`scale(${1680 / width}, ${1680 / height})`}>{paths}</g>
      </svg>
      <span>{children}</span>
    </span>
  );
};

export default InlineSVGIcon;
