import { toast, ToastT } from 'sonner';

//custom Sonner toast function instead depricated Schadcn Toast

export function actionToast({
    actionData,
    ...props
  }: Omit<ToastT, 'id'> & {
    actionData: { error: boolean; message: string }
}){
  if(actionData.error === true){
    return toast.error('Error',{description: actionData.message})
  }
  return toast.success('Success', {...props, description: actionData.message})
}

