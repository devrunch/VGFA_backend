export default class Response {
    constructor(resStatus = 200, message = "", data = null) {
        this.resStatus = resStatus;
        this.message = message;
        this.data = data;
    }

    getStatus() {
        return this.resStatus;
    }

    getMessage() {
        return this.message;
    }

    getData() {
        return this.data;
    }

    setStatus(val) {
        this.resStatus = val;
        return this;
    }

    setMessage(val) {
        this.message = val;
        return this;
    }

    setData(val) {
        this.data = val;
        return this;
    }

    success(res) {
        res.status(this.resStatus).json({
            success: true,
            message: this.message,
            data: this.data
        });
    }

    error(res) {
        res.status(this.resStatus).json({
            success: false,
            message: this.message,
            data: this.data
        });
        console.log(this);
    }
}
