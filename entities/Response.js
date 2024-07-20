class Response {
  constructor(status, message, data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
  getStatus() {
    return this.status;
  }
  getMessage() {
    return this.message;
  }
  getData() {
    return this.data;
  }
  setStatus(status) {
    this.status = status;
  }
  setMessage(message) {
    this.message = message;
  }
  setData(data) {
    this.data = data;
  }
}
export default Response;
