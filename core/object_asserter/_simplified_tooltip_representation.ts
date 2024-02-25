export type SimplifiedTooltipRepresentation<Type> = Type extends
  Record<string, unknown>
  ? { [Key in keyof Type]: SimplifiedTooltipRepresentation<Type[Key]> }
  : Type;
