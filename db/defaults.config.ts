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
        page: "test",
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
        name: "Admin",
        page: "test",
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
        id: "r3",
        name: "Marketing",
        page: "test",
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
        id: "r4",
        name: "Sales",
        page: "test",
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
        id: "r5",
        name: "Seeking",
        page: "test",
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
        name: "test",
        column: "Select Example",
        type: "Select",
        options: ["Option A","Option B","Option C"]
    },
    {
        id: "5038ca4c-6d12-4ba2-adaf-c422428ad041",
        name: "test",
        column: "Text Column",
        type: "Text",
        options: []
    },
    {
        id: "94aa008b-7fe0-4e9f-b5a2-3e4bdbd00536",
        name: "test",
        column: "Is Boolean",
        type: "Boolean",
        options: []
    }
];



export const recordDefaultData = [
    {
        id: "5d9bef07-3cb0-4f0b-a92a-c13d7d9ea08e",
        page: "test",
        data: {"Select Example":"Hello","Text Column":"World", "Is Boolean":"true"},
        author: "Owner",
        assignedUsers: ["Owner"]
    }
];



export const defaults: any = {
    User: usersDefaultData,
    Page: pageDefaultData,
    Role: rolesDefaultData,
    Record: recordDefaultData
}