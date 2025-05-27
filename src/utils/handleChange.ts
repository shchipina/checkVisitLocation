export const handleChange = (
  setter: (value: string) => void,
  clearError?: () => void,
) => (e: React.ChangeEvent<HTMLInputElement>) => {
  setter(e.target.value);
  
  if (clearError) {
    clearError();
  }
}