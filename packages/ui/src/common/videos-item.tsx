import React from 'react';

type VideosItemProps = {
  title: string;
  embeds?: boolean;
  aspectOne?: boolean;
  aspectFour?: boolean;
  aspectTwentyOne?: boolean;
};

export const VideosItem: React.FC<VideosItemProps> = ({
  title,
  embeds,
  aspectOne,
  aspectFour,
  aspectTwentyOne,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke p-4 dark:border-strokedark sm:px-6 xl:px-7.5">
        <h3 className="font-medium text-black dark:text-white">{title}</h3>
      </div>

      <div className="p-4 sm:p-6 xl:p-10">
        <iframe
          title={title}
          className={`w-full 
            ${embeds && 'aspect-video'} 
            ${aspectOne && 'aspect-square'} 
            ${aspectFour && 'aspect-4/3'} 
            ${aspectTwentyOne && 'aspect-21/9'}
          `}
          src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
          allowFullScreen
        />
      </div>
    </div>
  );
};
