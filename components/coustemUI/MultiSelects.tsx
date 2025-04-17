import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { useState } from "react";
import { X } from "lucide-react";

interface MultiSelectsPropes {
    values: string[];
    onChange: (value: string) => void;
    placeholder: string;
    collections: CollectionType[]
    onRemonve: (value: string) => void;
}

const MultiSelects: React.FC<MultiSelectsPropes> = ({ values, onChange, placeholder, collections, onRemonve }) => {
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);

    let selected: CollectionType[];

    if (values.length === 0) {
        selected = [];
    } else {
        selected = values.map((id) =>
            collections.find((collection) => collection.id === id)
        ) as CollectionType[];
    }

    const selectables = collections.filter(
        (collection) => !selected.includes(collection)
    );

    return (
        <div>
            {selected?.map((collection) => (
                <div
                    key={collection.id}
                    className="rounded flex flex-nowrap items-center justify-between font-normal w-full py-1.5 px-4 border"
                >
                    {collection?.title}
                    <button
                        onClick={() => onRemonve(collection.id)}
                        type="button"
                        className="rounded-full"
                    >
                        <X className="w-4 h-4 m-1" />
                    </button>
                </div>
            ))}
            <Command className={`overflow-visible ${values?.length === 1 && 'hidden'}`}>
                <div className="flex flex-wrap gap-2 border rounded-md">


                    <CommandInput
                        placeholder={placeholder}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                    />
                </div>

                <div className={` relative mt-2 ${values.length === 1 ? 'hidden' : null}`}>
                    {open && (
                        <CommandList className=" absolute w-full top-0 overflow-auto border rounded-lg shadow-lg z-30">
                            <CommandEmpty className="h-8 px-6">No results found.</CommandEmpty>
                            <CommandGroup>
                                {selectables.map((collection) => (
                                    <CommandItem
                                        key={collection.id}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onSelect={() => {
                                            onChange(collection.id);
                                            setInputValue("");
                                        }}
                                        className="hover:bg-gray-400 cursor-pointer"
                                    >
                                        {collection?.title}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    )}
                </div>
            </Command>
        </div>

    )
}

export const dynamic = "force-dynamic";
export default MultiSelects;