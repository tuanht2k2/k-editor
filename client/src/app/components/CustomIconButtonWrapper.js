function CustomIconButtonWrapper({
  children,
  active,
  title,
  fn,
  height,
  width,
  className,
  disabled,
}) {
  return (
    <button
      className={`flex items-center justify-center p-1 hover:bg-slate-200 rounded-full duration-300 ${className}  ${
        active && "bg-slate-200"
      } `}
      title={title}
      onClick={fn}
      style={{ width: width, height: height }}
    >
      {children}
    </button>
  );
}

export default CustomIconButtonWrapper;
