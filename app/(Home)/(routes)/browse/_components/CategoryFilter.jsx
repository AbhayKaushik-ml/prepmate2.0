"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function CategoryFilter() {
    const router = useRouter();
    
    const filterOptions = [
        { id: 1, name: "All", value: "all", path: "/browse" },
        { id: 2, name: "ML/AI", value: "ml-ai", path: "/categories/ml-ai" },
        { id: 3, name: "WEB DEV", value: "web-dev", path: "/categories/web-dev" },
        { id: 4, name: "MOBILE DEV", value: "mobile-dev", path: "/categories/mobile-dev" },
        { id: 5, name: "Cloud Computing", value: "cloud-computing", path: "/categories/cloud-computing" },
        { id: 6, name: "DevOps", value: "devops", path: "/categories/devops" },
        { id: 7, name: "MLOps", value: "mlops", path: "/categories/mlops" },
        { id: 8, name: "DSA", value: "dsa", path: "/categories/dsa" },
    ];

    const [activeFilter, setActiveFilter] = useState("all");

    const handleFilterClick = (value, path) => {
        setActiveFilter(value);
        router.push(path);
    };

    return (
        <div className="glassmorphic dark:bg-black/40 backdrop-blur-md p-4 rounded-xl mb-6 overflow-x-auto">
            <div className="flex gap-3 min-w-max">
                {filterOptions.map((item) => (
                    <button
                        key={item.id}
                        className={`
                            px-5 py-2.5 text-[12px] rounded-full font-semibold
                            border border-transparent
                            transition-all duration-300 ease-out
                            ${activeFilter === item.value
                                ? "bg-purple-500 dark:bg-purple-600 text-white shadow-lg shadow-purple-500/30 dark:shadow-purple-600/30 neon-glow-purple"
                                : "hover:bg-purple-100/20 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 dark:text-gray-300"
                            }
                        `}
                        onClick={() => handleFilterClick(item.value, item.path)}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CategoryFilter;
