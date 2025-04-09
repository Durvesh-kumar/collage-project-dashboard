import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MultiTextsProps {
  values: string[];
  onChange: (value: string)=> void;
  onRemove: (value: string)=> void;
  placeholder: string;
}
const MultiTexts:React.FC<MultiTextsProps> = ({values, onChange, onRemove, placeholder}) => {
  const [inputValue, setInputValue] = useState('');

  const addValue = (inputValue:string)=>{
    onChange(inputValue)
    setInputValue('')
  }
  return (
    <div className="grid gap-3">
      <Input 
        type="text" 
        placeholder={placeholder} 
        value={inputValue}
        onKeyDown={(e)=>{
          if(e.key == "Enter"){
            e.preventDefault();
            if(inputValue.length >1){
              addValue(inputValue)
            }
          }

        }
        }
        onChange={(e)=> setInputValue(e.target.value)}/>
        <div className="flex items-center gap-3 flex-wrap">
      {
        values?.map((text)=>(
          <Badge key={text}
           className="flex items-center gap-1 py-1 font-medium"
          >
            {text}
            <button onClick={()=> onRemove(text)} className="px-1 hover:bg-black rounded-full">X</button>
          </Badge>
        ))
      }
    </div>
    </div>
    
  )
}

export default MultiTexts;