/**
 * Validation Class
 */
export default class Validation{

    success : boolean
    message : string

    /**
     * Create a new validation object
     * @param success if the validations was successful
     * @param message the validation message, if validation failed
     */
    constructor(success : boolean = true, message : string = "") {
        this.success = success
        this.message = message
    }
}