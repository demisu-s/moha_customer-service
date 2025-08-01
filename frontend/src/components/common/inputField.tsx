import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type InputFieldProps = React.ComponentPropsWithRef<typeof Input> & {
    error?: Record<string, string>;
    handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    (
        {
            type = "text",
            name,
            placeholder,
            value,
            required = false,
            handleChange,
            error,
            className,
            ...props
        },
        ref,
    ) => {
        const [inputType, setInputType] = useState(type);

        const togglePassword = () => {
            setInputType(inputType === "password" ? "text" : "password");
        };

        return (
            <div className="space-y-2 w-full">
                <div className="relative">
                    <Input
                        type={inputType}
                        name={name}
                        id={name}
                        placeholder={placeholder}
                        value={value}
                        required={required}
                        onChange={handleChange}
                        ref={ref}
                        className={cn(
                            name && error && error[name] ? "border-red-500" : "",
                            className,
                        )}
                        {...props}
                    />
                    {type === "password" && (
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            {inputType === "password" ? (
                                <EyeIcon className="h-4 w-4 text-gray-500" />
                            ) : (
                                <EyeOffIcon className="h-4 w-4 text-gray-500" />
                            )}
                        </button>
                    )}
                </div>
                {name && error && error[name] && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="i-lucide-alert-circle h-4 w-4" />
                        {error[name]}
                    </p>
                )}
            </div>
        );
    },
);

InputField.displayName = "InputField";

export default InputField;
