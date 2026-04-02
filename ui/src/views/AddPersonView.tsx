import { useNavigate } from 'react-router-dom';
import { PersonForm } from '../components/PersonForm';
import { useCreatePerson } from '../api/usePeople';
import { useToast } from '../context/ToastContext';

export function AddPersonView() {
  const navigate = useNavigate();
  const createPerson = useCreatePerson();
  const { showToast } = useToast();

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Add New Person</h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter the person's information to add them to the family tree
      </p>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <PersonForm
          submitLabel="Add Person"
          isSubmitting={createPerson.isPending}
          apiError={createPerson.error?.message}
          onSubmit={(dto) =>
            createPerson.mutate(dto, {
              onSuccess: () => {
                showToast('Person added successfully');
                navigate('/');
              },
            })
          }
        />
        <button
          onClick={() => navigate('/')}
          className="w-full bg-gray-100 text-gray-900 rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-200 mt-3 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
