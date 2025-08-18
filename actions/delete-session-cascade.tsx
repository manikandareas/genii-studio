import { type DocumentActionProps, useClient } from "sanity";

export const DeleteSessionCascade = (props: DocumentActionProps) => {
	const client = useClient({ apiVersion: "2025-07-01" });
	return {
		label: "Delete session + messages",
		tone: "critical",
		onHandle: async () => {
			const sessionId = props.id;
			const msgIds: string[] = await client.fetch(
				`*[_type=="chatMessage" && chatSession._ref==$id][]._id`,
				{ id: sessionId },
			);
			const tx = client.transaction();
			msgIds.forEach((id) => tx.delete(id));
			tx.delete(sessionId);
			await tx.commit({ visibility: "async" });
			props.onComplete();
		},
	};
};
