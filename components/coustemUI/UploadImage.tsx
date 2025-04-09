import React from "react";
import { Button } from "../ui/button";
import { CldUploadWidget } from "next-cloudinary";
import { ImageUp, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface Props {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  type: string;
}

export const UploadImage: React.FC<Props> = ({
  value,
  onChange,
  onRemove,
  type,
}) => {
    const onSuccess= async(result:any)=>{
        const url = result?.info.secure_url;

        if(url !== ""){
            onChange(url)
        }
    }
  return (
    <div>
        <div className='flex flex-wrap items-center gap-4 my-8'>
        {
          value?.map((image: string) => (
            <div key={image} className='w-[200px] h-[220px] rounded border shadow-md gap-10 relative'>
              <Image src={image} alt='Image' width={1000} height={1000} sizes='sm' className='w-[200px] h-[220px] object-scale-down rounded shadow-md' />
              <div onClick={()=> onRemove(image)} className='absolute right-1 p-1 top-1 text-white hover:bg-red-600 z-10 rounded bg-red-400 cursor-pointer'><Trash2 className=''/></div>
            </div>

          ))
        }
      </div>
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET}
        onSuccess={onSuccess}
      >
        {({ open }) => {
          return (
            <div>
              {type === "Collection" ? (
                <Button
                  type="button"
                  onClick={() => open()}
                  className={`px-6 flex gap-2 ${
                    value[1] ? "hidden" : null
                  }`}
                >
                  {value[0] ? (
                    <Plus className="w-4 h-4" />
                  ) : (
                    <ImageUp className="w-4 h-4" />
                  )}
                  <span>Upload an Image</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => open()}
                  className={`px-6 flex gap-2 ${
                    value[7] ? "hidden" : null
                  }`}
                >
                  {value[0] ? (
                    <Plus className="w-4 h-4" />
                  ) : (
                    <ImageUp className="w-4 h-4" />
                  )}
                  <span>Upload an Image</span>
                </Button>
              )}
            </div>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};
