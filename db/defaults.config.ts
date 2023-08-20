type TUser = {
    id?: string,
    name: string,
    email: string,
    password?: string,
    hash?: string,
    phone: string,
    role: "Seeking" | "Marketing" | "Sales" | "Admin" | "SuperAdmin",
    lastActive?: string
}


export const usersDefaultData: Array<TUser> = [
    {
        id: "0",
        name: "Owner",
        email: "admin@admin",
        password: "admin",
        phone: "0",
        role: "SuperAdmin",
        lastActive: "0"
    },
    {
        id: "1",
        name: "AdminTest",
        email: "admin@test",
        password: "test",
        phone: "0",
        role: "Admin",
        lastActive: "0"
    },
    {
        id: "2",
        name: "MarketingTest",
        email: "marketing@test",
        password: "test",
        phone: "0",
        role: "Marketing",
        lastActive: "0"
    },
    {
        id: "3",
        name: "Sales",
        email: "sales@test",
        password: "test",
        phone: "0",
        role: "Sales",
        lastActive: "0"
    },
    {
        id: "4",
        name: "SeekingTest",
        email: "seeking@test",
        password: "test",
        phone: "0",
        role: "Seeking",
        lastActive: "0"
    }
];





export const rolesDefaultData = [
    {
        id: "r1",
        name: "SuperAdmin",
        page: "Test",
        columns: ["*"],
        read: ["*"],
        write: true,
        edit: ["*"],
        delete: ["*"],
        import: true,
        export: true,
        assign: ["*"],
        search: true
    },
    {
        id: "r2",
        name: "SuperAdmin",
        page: "Properties",
        columns: ["*"],
        read: ["*"],
        write: true,
        edit: ["*"],
        delete: ["*"],
        import: true,
        export: true,
        assign: ["*"],
        search: true
    },
    {
        id: "r3",
        name: "SuperAdmin",
        page: "Contracts",
        columns: ["*"],
        read: ["*"],
        write: true,
        edit: ["*"],
        delete: ["*"],
        import: true,
        export: true,
        assign: ["*"],
        search: true
    },
    {
        id: "r4",
        name: "Admin",
        page: "Properties",
        columns: ["*"],
        read: ["Own", "Admin", "Marketing", "Sales", "Seeking"],
        write: true,
        edit: ["Own", "Admin", "Marketing", "Sales", "Seeking"],
        delete: ["Own", "Admin", "Marketing", "Sales", "Seeking"],
        import: true,
        export: true,
        assign: ["Own", "Admin", "Marketing", "Sales", "Seeking"],
        search: true
    },
    {
        id: "r5",
        name: "Marketing",
        page: "Properties",
        columns: ["code","condo","rentPrice","salePrice","mark","status","dateForUpdateByUser"],
        read: ["Own", "SuperAdmin", "Admin", "Marketing", "Sales", "Seeking"],
        write: true,
        edit: ["Own"],
        delete: ["Own"],
        import: true,
        export: false,
        assign: [],
        search: true
    },
    {
        id: "r6",
        name: "Sales",
        page: "Properties",
        columns: ["condo","provice","area","size","floor","type"],
        read: ["Own","SuperAdmin", "Admin", "Marketing", "Sales", "Seeking"],
        write: true,
        edit: ["Own"],
        delete: [],
        import: false,
        export: false,
        assign: [],
        search: true
    },
    {
        id: "r7",
        name: "Seeking",
        page: "Properties",
        columns: ["*"],
        read: ["Own"],
        write: true,
        edit: ["Own"],
        delete: ["Own"],
        import: false,
        export: false,
        assign: ["Own"],
        search: true
    }
];


export const pageDefaultData = [
    {
        id: "1f551483-bdf3-4df1-acda-2494ef0e8136",
        name: "Test",
        column: "Select Example",
        type: "Select",
        options: ["Option A","Option B","Option C"]
    },
    {
        id: "5038ca4c-6d12-4ba2-adaf-c422428ad041",
        name: "Test",
        column: "Text Column",
        type: "Text"
    },
    {
        id: "94aa008b-7fe0-4e9f-b5a2-3e4bdbd00536",
        name: "Test",
        column: "Is Boolean",
        type: "Boolean"
    }
];



export const defaults: any = {
    User: usersDefaultData,
    Page: pageDefaultData,
    Role: rolesDefaultData 
}