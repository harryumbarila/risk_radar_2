interface LoaderProps {
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
}

const sizeMap = {
  small: "h-8 w-8 border-2",
  medium: "h-12 w-12 border-3",
  large: "h-16 w-16 border-4",
};

const Loader = ({ size = "large", fullScreen = true }: LoaderProps) => {
  const wrapperClasses = fullScreen
    ? "flex h-screen items-center justify-center bg-white dark:bg-black"
    : "flex items-center justify-center";

  return (
    <div className={wrapperClasses}>
      <div
        className={`${sizeMap[size]} animate-spin rounded-full border-solid border-primary border-t-transparent`}
      ></div>
    </div>
  );
};

export default Loader;
