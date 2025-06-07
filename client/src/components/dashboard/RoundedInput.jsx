export default RoundedInput = ({ label, placeholder, name, control }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="rounded-xl border border-gray-200 p-4 shadow-sm bg-gray-50">
        <FormLabel className="text-gray-700">{label}</FormLabel>
        <FormControl>
          <Input placeholder={placeholder} {...field} className="rounded-lg" />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
