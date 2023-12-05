import React, { useEffect, useState } from "react";
import { getInvites } from "../../api/invite";
import {
  Box,
  Center,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { UserType } from "../../types/userTypes";
import { useDispatch, useSelector } from "../../store";
import { SarcoTableHead } from "ui/sarcophagi/components/SarcoTableHead";
import { InviteForm } from "./inviteForm";
import { setInvites } from "store/user/actions";

export const InvitesPage: React.FC = () => {
  const { user: appUser, invites } = useSelector((x) => x.userState);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoadingInvites(true);

    getInvites()
      .then((res) => {
        console.log(res);
        dispatch(setInvites(res));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingInvites(false);
      });
  }, [dispatch]);

  return appUser?.type === UserType.client ? (
    <Box>
      <Text>You are not authorized to view this page.</Text>
    </Box>
  ) : (
    <Box>
      <Text fontWeight="bold" mb={5}>
        Your Invites
      </Text>

      <TableContainer overflowY="auto" h="100%">
        <Table variant="unstyled" size="sm">
          <Thead
            position="sticky"
            top={0}
            bg="black"
            // Prevents buttons from appearing over the table header, 10,000 is an arbitrary number
            // that just so happens to work
            zIndex={10_000}
          >
            <Tr>
              <SarcoTableHead
                w={175}
                sortable
                // sortDirection={
                //   sortColumnId === SortableColumn.State ? sortDirection : SortDirection.None
                // }
                // onClickSort={() => handleClickSort(SortableColumn.State)}
              >
                Client Email
              </SarcoTableHead>
              <SarcoTableHead
                sortable
                // sortDirection={sortColumnId === "name" ? sortDirection : SortDirection.None}
                // onClickSort={() => handleClickSort(SortableColumn.Name)}
              >
                Status
              </SarcoTableHead>
            </Tr>
          </Thead>
          <Tbody>
            {loadingInvites && invites?.length === 0 ? (
              <Center>
                <Spinner />
              </Center>
            ) : invites?.length === 0 ? (
              <Center>
                <Text>No invites found</Text>
              </Center>
            ) : (
              invites?.map((invite) => (
                <Tr>
                  <Td>
                    <Text>{invite.clientEmail}</Text>
                  </Td>
                  <Td>
                    <Text>{invite.status}</Text>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Box my={100} />

      <InviteForm />
    </Box>
  );
};
