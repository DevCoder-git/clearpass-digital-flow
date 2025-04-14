
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

const departments = [
  { id: 'library', name: 'Library' },
  { id: 'hostel', name: 'Hostel' },
  { id: 'accounts', name: 'Accounts Department' },
  { id: 'sports', name: 'Sports Department' },
  { id: 'lab', name: 'Laboratory' },
  { id: 'academics', name: 'Academic Department' },
];

const formSchema = z.object({
  departments: z.array(z.string()).min(1, {
    message: 'Please select at least one department',
  }),
});

const ClearanceRequest: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departments: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log('Submitted clearance request:', values);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Clearance request submitted successfully!');
      navigate('/dashboard/requests');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Apply for Clearance</CardTitle>
        <CardDescription>
          Select the departments from which you need clearance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="departments"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {departments.map((department) => (
                      <FormField
                        key={department.id}
                        control={form.control}
                        name="departments"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={department.id}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(department.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, department.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== department.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {department.name}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormDescription>
                    You must get clearance from all selected departments before receiving your final certificate.
                  </FormDescription>
                </FormItem>
              )}
            />
            <CardFooter className="flex justify-end space-x-4 px-0">
              <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ClearanceRequest;
