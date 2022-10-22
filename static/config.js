export default {
    transport: 'ws',
    apiUrl: 'ws://127.0.0.1:8001/ ',
    structure: '{"user":{"create":["record"],"read":["id"],"update":["id","record"],"delete":["id"],"find":["mask"]},"country":{"read":["id"],"delete":["id"],"find":["mask"]}}',
}