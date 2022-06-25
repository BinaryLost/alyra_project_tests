# Testing

## eth gas

| Method       |Avg|
|--------------|-------|
| addVoter     |    50196   |
| setVote     |    58101   |
| startVotingSession     |    30530   |
| total voting |    2137238   |

## add voter

- Un non owner ne doit pas pouvoir ajouter un voter
- L'owner peut ajouter un voter, un évènement est déclenché
- L'owner ne doit pas pouvoir ajouter 2 fois un même voter
- Le voter ajouté doit se retrouver dans la liste whitelisted

## vote

- Un non électeur échoue à voter
- Un électeur réussi à voter
- Un électeur ayant voté est enregistré "a voté"
- Un électeur ayant déjà voté échoue à voter une nouvelle fois

