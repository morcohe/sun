

const hasAdd = (accessConfig: any) => {
    return accessConfig?.write;
}


const hasImport = (accessConfig: any) => {
    return accessConfig?.import;
}


const hasExport = (accessConfig: any) => {
    return accessConfig?.export;
}


const hasSearch = (accessConfig: any) => {
    return accessConfig?.search;
}








const isDelete = (accessConfig: any, user: any, assignedUsers?: any) => {
    if(accessConfig){
        if(!accessConfig?.delete){
            return false;
        }
        try {
            if (accessConfig?.delete[0] === "*") {
                return true;
            }
        } catch (error) {
            null;
        }
        
        if (assignedUsers && accessConfig?.delete?.includes("Own") && assignedUsers.includes(user.name)) {
            return true;
        } else if (accessConfig?.delete?.includes(user.role)) {
            return true
        }
    }
    
    return false;
}


const isEdit = (accessConfig: any, user: any, assignedUsers?: any) => {
    
    if(accessConfig){
        if(!accessConfig?.edit){
            return false;
        }
        try {
            if (accessConfig?.edit[0] === "*") {
                return true;
            }
        } catch (error) {
            null;
        }
        
        if (assignedUsers && accessConfig?.edit?.includes("Own") && assignedUsers.includes(user.name)) {
            return true;
        } else if (accessConfig?.edit?.includes(user.role)) {
            return true
        }
    }
    
    return false;
}


const isAssigned = (accessConfig: any, user: any, assignedUsers: any) => {
    if(accessConfig){
        try {
            if (accessConfig?.assign[0] === "*") {
                return true;
            }
        } catch (error) {
            null;
        }
        
        if (accessConfig?.assign?.includes("Own") && assignedUsers.includes(user.name)) {
            return true;
        } else if (accessConfig?.assign?.includes(user.role)) {
            return true
        }
    }
    
    return false;
}




export const validators = {
    hasAdd, hasExport, hasImport, hasSearch, isAssigned, isDelete, isEdit
}