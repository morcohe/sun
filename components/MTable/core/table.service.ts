

class MTableService {

    private state : any;
    private notifier: any;

    constructor(){}

    signComponent = (fn: any) => {
        this.notifier = fn;
    }

    set = (data:any) => {
        this.state = data;
        this.notifier(this.state);
    }

    add = (stateItem: any) => {
        this.state = [ stateItem, ...this.state ];
        this.notifier(this.state);
    }

}


export default MTableService;