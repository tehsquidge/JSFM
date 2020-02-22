declare module '*.schema.json' {
    import { ErrorObject } from 'ajv';
  
    interface ValidateFn {
        (data: object): boolean;
        errors: ErrorObject[] | null;
    }
    const validate: ValidateFn;
    export default validate;
  }
  