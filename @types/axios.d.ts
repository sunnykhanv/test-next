import 'axios';
import { Session } from 'next-auth';

declare module 'axios' {
  interface AxiosRequestConfig {
    session?: Session | null;
    useAuth?: boolean;
  }
}
