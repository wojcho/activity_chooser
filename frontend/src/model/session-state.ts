export enum SessionState {
  /** State machine
  * At beginning state is New
  * First user confirms chosen tags with their token and state becomes PartlyClosed
  * Another user confirms chosen tags with their token and state becomes Closed
  */
  New,
  PartlyClosed,
  Closed,
}
