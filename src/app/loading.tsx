import { Loader } from '../components/loader';

export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <Loader className="mt-[400px]" />
    </div>
  );
}
