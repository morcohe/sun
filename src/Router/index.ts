


export const routes: any = {
    "Properties": {
        title: "Properties",
        path: "/dashboard/properties",
        icon: "home",
        allowed: ["SuperAdmin", "Admin", "Marketing", "Sales", "Seeking"]
    },
    "Contracts": {
        title: "Contracts",
        path: "/dashboard/contracts",
        icon: "home",
        allowed: ["SuperAdmin", "Admin"]
    }
};


export const managementRoutes: any = {
    "Users": {
        title: "Users",
        path: "/dashboard/management/users",
        icon: "home",
        allowed: ["SuperAdmin"]
    },
    "Roles": {
        title: "Roles",
        path: "/dashboard/management/roles",
        icon: "home",
        allowed: ["SuperAdmin"]
    },
    "Pages": {
        title: "Tables",
        path: "/dashboard/management/pages",
        icon: "home",
        allowed: ["SuperAdmin"]
    },
    
};