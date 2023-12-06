import HeadlessTippy from "@tippyjs/react/headless";

function RegularTippy({ children, render, placement, visible }) {
  return (
    <HeadlessTippy
      interactive
      visible={visible}
      render={() => (
        <div className="p-5 rounded-xl shadow-md shadow-slate-300 bg-white border-2 border-slate-100">
          {render}
        </div>
      )}
      placement={placement}
    >
      {children}
    </HeadlessTippy>
  );
}

export default RegularTippy;
