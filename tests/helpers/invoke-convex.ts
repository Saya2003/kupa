export function invokeConvex<Args, Return>(
  registered: unknown,
  ctx: unknown,
  args: Args,
): Promise<Return> {
  const target = registered as {
    _handler: (innerCtx: unknown, innerArgs: Args) => Promise<Return>;
  };
  return target._handler(ctx, args);
}
